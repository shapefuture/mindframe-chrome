
output "worker_script_id" {
  description = "ID of the deployed worker script"
  value       = module.mindframe_worker_dev.worker_script_id
}

output "worker_route_id" {
  description = "ID of the worker route"
  value       = module.mindframe_worker_dev.worker_route_id
}

output "kv_namespace_id" {
  description = "ID of the KV namespace"
  value       = module.mindframe_worker_dev.kv_namespace_id
}
