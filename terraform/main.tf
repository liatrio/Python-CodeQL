terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.19.0"
    }
  }
  #backend "gcs" {
  #  bucket = "ajwhite-csuc-capstone-gcs"
  #  prefix = "terraform/state"
  #}
}

provider "google" {
  project = var.project_name
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  project = var.project_name
  region  = var.region
  zone    = var.zone
}

resource "google_project" "ajwhite_csuc_capstone" {
  provider            = google
  auto_create_network = true
  billing_account     = var.billing_account
  name                = var.project_name
  org_id              = var.org_id
  project_id          = var.project_id
  skip_delete         = true
}

#resource "google_storage_bucket" "ajwhite_csuc_capstone_gcs" {
#  provider                    = google-beta
#  force_destroy               = true
#  location                    = var.region
#  name                        = "${var.project_name}-gcs"
#  project                     = var.project_id
#  public_access_prevention    = "enforced"
#  storage_class               = "STANDARD"
#  uniform_bucket_level_access = true
#}

resource "google_compute_global_address" "default_ip_range" {
  provider      = google
  address       = "10.90.96.0"
  address_type  = "INTERNAL"
  name          = "default-ip-range"
  network       = "https://www.googleapis.com/compute/v1/projects/${var.project_id}/global/networks/default"
  prefix_length = 20
  project       = var.project_id
  purpose       = "VPC_PEERING"
}

resource "google_service_networking_connection" "gcp_vpc_interconnect" {
  network                 = "projects/${var.project_id}/global/networks/default"
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.default_ip_range.name]
}

resource "google_compute_global_address" "mdc_external_ip" {
  provider     = google
  address_type = "EXTERNAL"
  name         = "mdc-external-ip"
  project      = var.project_id
}

resource "google_sql_database_instance" "mdc_database_v1" {
  provider            = google
  database_version    = "POSTGRES_14"
  name                = "mdc-database-v1"
  project             = var.project_id
  region              = var.region
  deletion_protection = false
  depends_on          = [google_service_networking_connection.gcp_vpc_interconnect]
  settings {
    activation_policy     = "ALWAYS"
    availability_type     = "ZONAL"
    disk_autoresize       = false
    disk_autoresize_limit = 0
    disk_size             = 20
    disk_type             = "PD_SSD"
    ip_configuration {
      allocated_ip_range = google_compute_global_address.default_ip_range.name
      ipv4_enabled       = false
      private_network    = "projects/${var.project_id}/global/networks/default"
    }
    location_preference {
      zone = var.zone
    }
    pricing_plan = "PER_USE"
    tier         = "db-f1-micro"
  }
}

resource "google_sql_user" "mdc_database_user" {
  provider        = google
  name            = "mdc-database-user"
  instance        = google_sql_database_instance.mdc_database_v1.name
  password        = var.mdc_database_user_password
  project         = var.project_id
  deletion_policy = "ABANDON"
}

resource "google_artifact_registry_repository" "mdc_image_repository" {
  provider      = google-beta
  format        = "DOCKER"
  location      = var.region
  project       = var.project_id
  repository_id = "mdc-image-repository"
}

resource "google_container_cluster" "mdc_prod_cluster" {
  provider           = google
  name               = "mdc-prod-cluster"
  location           = var.zone
  project            = var.project_id
  initial_node_count = 3
  networking_mode    = "VPC_NATIVE"
  master_authorized_networks_config {
    cidr_blocks {
      cidr_block   = "132.241.174.194/32"
      display_name = "school"
    }
  }
  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.32/28"
  }
  ip_allocation_policy {
    cluster_ipv4_cidr_block  = ""
    services_ipv4_cidr_block = ""
  }
  node_config {
    service_account = "${google_project.ajwhite_csuc_capstone.number}-compute@developer.gserviceaccount.com"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
    machine_type = "e2-micro"
  }
}
