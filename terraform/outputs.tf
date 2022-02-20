output "sql_database_private_ip_address" {
  value = google_sql_database_instance.mdc_database_v1.private_ip_address
}
