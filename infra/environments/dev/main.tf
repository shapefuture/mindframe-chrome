
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
  
  backend "local" {}
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

module "mindframe_worker_dev" {
  source = "../../modules/cloudflare_worker"

  environment           = "dev"
  cloudflare_account_id = var.cloudflare_account_id
  cloudflare_zone_id   = var.cloudflare_zone_id
  openrouter_api_key   = var.openrouter_api_key
  route_pattern        = "dev-mindframe-proxy.${var.domain}/*"
}
