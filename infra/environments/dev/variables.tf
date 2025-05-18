
variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}

variable "openrouter_api_key" {
  description = "OpenRouter API key"
  type        = string
  sensitive   = true
}

variable "domain" {
  description = "Domain name for the worker routes"
  type        = string
}
