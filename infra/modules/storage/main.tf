
# Create KV namespace
resource "cloudflare_workers_kv_namespace" "llm_cache" {
  title      = "${var.environment}-${var.namespace_name}"
  account_id = var.account_id
}

# Create KV namespace binding
resource "cloudflare_workers_kv_namespace_binding" "llm_cache_binding" {
  name         = "MINDFRAME_CACHE"
  namespace_id = cloudflare_workers_kv_namespace.llm_cache.id
  account_id   = var.account_id
  script_name  = var.worker_script_name
}
