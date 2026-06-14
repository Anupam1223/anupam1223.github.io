import torch
import torch.nn as nn
from torch.distributions import Independent, Normal

class AffineCouplingLayer(nn.Module):
    """
    A highly memory-efficient coupling layer for high-dimensional data (like 256D audio latents).
    Instead of Neural Splines, it uses simple scaling (s) and translation (t).
    """
    def __init__(self, dim, hidden_dim=256):
        super().__init__()
        self.half_dim = dim // 2
        
        # A simple, fast MLP to calculate scale and translation
        self.net = nn.Sequential(
            nn.Linear(self.half_dim, hidden_dim),
            nn.GELU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.GELU(),
            nn.Linear(hidden_dim, self.half_dim * 2) # Outputs both s and t
        )
        
        # Initialize the last layer to zero so the flow starts as an Identity function
        # This makes early training incredibly stable.
        nn.init.zeros_(self.net[-1].weight)
        nn.init.zeros_(self.net[-1].bias)

    def forward(self, z):
        # Split latent vector in half
        z1, z2 = z[..., :self.half_dim], z[..., self.half_dim:]
        
        # Calculate Scale (s) and Translation (t) using ONLY the first half
        st = self.net(z1)
        s, t = st.chunk(2, dim=-1)
        
        # Constrain the scale (s) using tanh to prevent exploding gradients
        s = torch.tanh(s) * 2.0 
        
        # Transform the second half
        z2_new = z2 * torch.exp(s) + t
        
        # Calculate log determinant (volume penalty)
        log_det = s.sum(dim=-1)
        
        return torch.cat([z1, z2_new], dim=-1), log_det

    def inverse(self, z):
        z1, z2 = z[..., :self.half_dim], z[..., self.half_dim:]
        
        st = self.net(z1)
        s, t = st.chunk(2, dim=-1)
        s = torch.tanh(s) * 2.0 
        
        # Exact algebraic inverse!
        z2_new = (z2 - t) * torch.exp(-s)
        
        return torch.cat([z1, z2_new], dim=-1)

class AudioLatentFlow(nn.Module):
    """
    The orchestrator. Stacks multiple Affine coupling layers, handles 
    the array swapping, and calculates the Log-Likelihood Loss.
    """
    def __init__(self, dim_theta=256, num_layers=8, hidden_dim=256):
        super().__init__()
        
        self.dim_theta = dim_theta
        
        # The Blueprint: Standard Normal Bell Curve N(0, 1)
        self.register_buffer('blueprint_loc', torch.zeros(dim_theta))
        self.register_buffer('blueprint_scale', torch.ones(dim_theta))
        
        # Stack layers
        self.layers = nn.ModuleList([
            AffineCouplingLayer(dim=dim_theta, hidden_dim=hidden_dim)
            for _ in range(num_layers)
        ])

    def get_blueprint(self):
        """Returns the standard Normal distribution for grading."""
        return Independent(
            Normal(self.blueprint_loc, self.blueprint_scale),
            reinterpreted_batch_ndims=1
        )

    def forward(self, z):
        """
        TRAINING PASS: Takes audio latents (z) and pushes them to base Gaussian (u).
        """
        total_log_det = 0
        u = z
        
        for layer in self.layers:
            u, log_det = layer(u)
            total_log_det += log_det
            
            # THE SWAP: Flip the tensor array entirely 
            u = torch.flip(u, dims=[-1]).contiguous()
            
        return u, total_log_det

    def compute_loss(self, z):
        """
        Calculates how well the flow maps the audio latents to a Bell Curve.
        """
        u_final, total_volume_penalty = self.forward(z)
        
        blueprint = self.get_blueprint()
        blueprint_score = blueprint.log_prob(u_final)
        
        # NLL objective — minimize negative log-likelihood
        loss = -1 * (blueprint_score + total_volume_penalty)
        return loss.mean()

    def sample(self, num_samples=1, device="cpu"):
        """
        INFERENCE PASS: Generates completely new audio latents from thin air!
        """
        blueprint = self.get_blueprint()
        u = blueprint.sample((num_samples,)).to(device)
        
        for layer in reversed(self.layers):
            u = torch.flip(u, dims=[-1]).contiguous()
            u = layer.inverse(u)
            
        return u