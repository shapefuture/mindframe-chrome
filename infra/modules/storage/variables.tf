
variable "environment" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
}

variable "namespace_name" {
  description = "Name of the KV namespace"
  type        = string
  default     = "mindframe-llm-cache"
}

variable "worker_script_name" {
  description = "Name of the Worker script to bind the KV namespace to"
  type        = string
}

variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "cache_ttl" {
  description = "Time to live for cached responses in seconds"
  type        = number
  default     = 3600
}

variable "max_cache_age" {
  description = "Maximum age of cached items in seconds"
  type        = number
  default     = 86400
}
