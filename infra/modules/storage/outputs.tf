
output "namespace_id" {
  value = cloudflare_workers_kv_namespace.llm_cache.id
}

output "binding_name" {
  value = cloudflare_workers_kv_namespace_binding.llm_cache_binding.name
}
