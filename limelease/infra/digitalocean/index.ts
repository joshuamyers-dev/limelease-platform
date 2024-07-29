import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

const containerRegistry = new digitalocean.ContainerRegistry(
  "ContainerRegistry",
  {
    name: "limelease",
    region: "SYD1",
    subscriptionTierSlug: "basic",
  }
);

const database = new digitalocean.DatabaseCluster("Database", {
  engine: "pg",
  name: `${pulumi.getStack()}-db`,
  nodeCount: 1,
  region: "SYD1",
  size: "db-s-1vcpu-1gb",
  version: "14",
});

const wordpressDroplet = new digitalocean.Droplet("Wordpress", {
  image: "ubuntu-20-04-x64",
  name: `${pulumi.getStack()}-wordpress`,
  region: "SYD1",
  size: "s-1vcpu-1gb",
  monitoring: true,
});
