
output "worker_name" {
  description = "Name of the deployed worker"
  value       = cloudflare_worker_script.mindframe_proxy.name
}

output "kv_namespace_id" {
  description = "ID of the KV namespace"
  value       = cloudflare_workers_kv_namespace.cache.id
}

output "worker_route" {
  description = "Worker route pattern if created"
  value       = var.create_route ? cloudflare_worker_route.mindframe_proxy[0].pattern : null
}
