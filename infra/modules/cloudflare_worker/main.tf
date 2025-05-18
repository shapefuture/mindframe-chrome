
resource "cloudflare_workers_kv_namespace" "cache" {
  account_id = var.cloudflare_account_id
  title      = "${var.environment}-mindframe-cache"
}

resource "cloudflare_worker_script" "mindframe_proxy" {
  account_id = var.cloudflare_account_id
  name       = "${var.environment}-mindframe-proxy"
  content    = file("${path.module}/worker/script.js")

  kv_namespace_binding {
    name         = "MINDFRAME_CACHE"
    namespace_id = cloudflare_workers_kv_namespace.cache.id
  }

  secret_text_binding {
    name = "OPENROUTER_API_KEY"
    text = var.openrouter_api_key
  }

  compatibility_date = "2024-02-15"
}

resource "cloudflare_worker_route" "mindframe_proxy" {
  count       = var.create_route ? 1 : 0
  zone_id     = var.cloudflare_zone_id
  pattern     = var.route_pattern
  script_name = cloudflare_worker_script.mindframe_proxy.name
}
