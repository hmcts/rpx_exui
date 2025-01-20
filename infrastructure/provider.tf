terraform {
  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.112.0"
    }
  }

  required_version = "~> 1.6.6"
}

provider "azurerm" {
  features {}
  skip_provider_registration = "true"
}
