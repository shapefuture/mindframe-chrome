
variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
}

variable "openrouter_api_key" {
  description = "OpenRouter API key for LLM access"
  type        = string
  sensitive   = true
}

variable "create_route" {
  description = "Whether to create a worker route"
  type        = bool
  default     = true
}

variable "route_pattern" {
  description = "Route pattern for the worker"
  type        = string
  default     = "mindframe-proxy.yourdomain.com/*"
}
