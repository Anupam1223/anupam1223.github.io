import torch
import torch.nn as nn
import torch.nn.functional as F

class ConvEncoder(nn.Module):
    def __init__(self, latent_dim=256):
        super().__init__()
        # Input: [Batch, 1, 80, 258]
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, stride=2, padding=1)  # -> [32, 40, 129]
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=2, padding=1) # -> [64, 20, 65]
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1) # -> [128, 10, 33]
        self.conv4 = nn.Conv2d(128, 256, kernel_size=3, stride=2, padding=1) # -> [256, 5, 17]
        
        self.flatten_size = 256 * 5 * 17  # 21,760
        
        self.fc_mu = nn.Linear(self.flatten_size, latent_dim)
        self.fc_logvar = nn.Linear(self.flatten_size, latent_dim)

    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = F.relu(self.conv2(x))
        x = F.relu(self.conv3(x))
        x = F.relu(self.conv4(x))
        x = x.view(x.size(0), -1) # Flatten
        
        mu = self.fc_mu(x)
        logvar = self.fc_logvar(x)
        return mu, logvar

class ConvDecoder(nn.Module):
    def __init__(self, latent_dim=256):
        super().__init__()
        self.flatten_size = 256 * 5 * 17
        self.fc = nn.Linear(latent_dim, self.flatten_size)
        
        # Deconvolutions using carefully calculated output_padding to restore exact original size
        self.deconv1 = nn.ConvTranspose2d(256, 128, kernel_size=3, stride=2, padding=1, output_padding=(1, 0)) # -> [128, 10, 33]
        self.deconv2 = nn.ConvTranspose2d(128, 64, kernel_size=3, stride=2, padding=1, output_padding=(1, 0))  # -> [64, 20, 65]
        self.deconv3 = nn.ConvTranspose2d(64, 32, kernel_size=3, stride=2, padding=1, output_padding=(1, 0))   # -> [32, 40, 129]
        self.deconv4 = nn.ConvTranspose2d(32, 1, kernel_size=3, stride=2, padding=1, output_padding=(1, 1))    # -> [1, 80, 258]

    def forward(self, z):
        x = self.fc(z)
        x = x.view(x.size(0), 256, 5, 17) # Unflatten
        
        x = F.relu(self.deconv1(x))
        x = F.relu(self.deconv2(x))
        x = F.relu(self.deconv3(x))
        x = self.deconv4(x) # No ReLU on output because normalized dB mel-specs can be negative
        return x

class VAE(nn.Module):
    def __init__(self, latent_dim=256):
        super().__init__()
        self.encoder = ConvEncoder(latent_dim)
        self.decoder = ConvDecoder(latent_dim)
        
    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def forward(self, x):
        mu, logvar = self.encoder(x)
        z = self.reparameterize(mu, logvar)
        reconstruction = self.decoder(z)
        return reconstruction, mu, logvar