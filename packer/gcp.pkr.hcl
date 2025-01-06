packer {
  required_plugins {
    googlecompute = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

variable "project_id" {
  type        = string
  default     = "plexiform-muse-414223"
  description = "Used for setting the project id"
}

variable "source_image_family" {
  type    = string
  default = "centos-stream-8"
}

variable "zone" {
  type    = string
  default = "us-east1-b"
}

variable "network" {
  type    = string
  default = "default"
}

variable "ssh_username" {
  type    = string
  default = "centos"
}

variable "image_family" {
  type    = string
  default = "centos-stream8"
}

source "googlecompute" "csye6225_custom_image" {
  project_id          = "${var.project_id}"
  source_image_family = "${var.source_image_family}"
  zone                = "${var.zone}"
  network             = "${var.network}"
  ssh_username        = "${var.ssh_username}"
  image_family        = "${var.image_family}"

}

build {
  sources = ["sources.googlecompute.csye6225_custom_image"]

  // provisioner "shell" {
  //   script = "./scripts/setup.sh"
  // }

  provisioner "shell" {
    script = "./scripts/installation.sh"
  }

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    script = "./scripts/fileTransfer.sh"
  }

  // provisioner "shell" {
  //   script = "./scripts/env.sh"
  // }

  provisioner "shell" {
    script          = "./scripts/permission.sh"
    execute_command = "chmod +x {{ .Path }}; {{ .Vars }} {{ .Path }}"
  }

  provisioner "shell" {
    script = "./scripts/opsAgentInstallation.sh"
  }

  post-processor "manifest" {
    output = "manifest.json"
  }
}