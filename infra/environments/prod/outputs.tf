
output "worker_script_id" {
  description = "ID of the deployed worker script"
  value       = module.mindframe_worker_prod.worker_script_id
}

output "worker_route_id" {
  description = "ID of the worker route"
  value       = module.mindframe_worker_prod.worker_route_id
}

output "kv_namespace_id" {
  description = "ID of the KV namespace"
  value       = module.mindframe_worker_prod.kv_namespace_id
}
