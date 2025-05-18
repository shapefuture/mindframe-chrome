
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
  
  backend "remote" {
    organization = "mindframe"
    workspaces {
      name = "mindframe-prod"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

module "mindframe_worker_prod" {
  source = "../../modules/cloudflare_worker"

  environment           = "prod"
  cloudflare_account_id = var.cloudflare_account_id
  cloudflare_zone_id   = var.cloudflare_zone_id
  openrouter_api_key   = var.openrouter_api_key
  route_pattern        = "mindframe-proxy.${var.domain}/*"
}
