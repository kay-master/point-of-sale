import { ServiceRegistry, ServiceRegistryPayload } from "./register";

function validateEnvVariables() {
	const requiredEnvVars = [
		"SERVICE_ID",
		"SERVICE_NAME",
		"SERVICE_ADDRESS",
		"PORT",
		"SERVICE_PREFIX",
	];

	const missingVars = requiredEnvVars.filter(
		(varName) => !process.env[varName],
	);

	if (missingVars.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missingVars.join(", ")}`,
		);
	}
}

/**
 * Register a service with Consul
 *
 * Will look for the following environment variables:
 * - PORT: Port number the service is running on
 * - SERVICE_ID: Unique ID of the service, e.g. `auth-service`
 * - SERVICE_NAME: Name of the service, e.g. `auth-service`
 * - SERVICE_PREFIX: Prefix for the service URL, e.g. `auth` for `/auth`
 * - SERVICE_ADDRESS: Address of the service, e.g. `auth` for `http://auth`
 */
export async function serviceDiscovery() {
	// Validate environment variables
	validateEnvVariables();

	const service: ServiceRegistryPayload = {
		ID: process.env.SERVICE_ID || "",
		Name: process.env.SERVICE_NAME || "",
		Address: process.env.SERVICE_ADDRESS || "",
		Port: parseInt(process.env.PORT || "", 10),
		Tags: [`urlprefix-/${process.env.SERVICE_PREFIX}`],
	};

	const serviceRegistry = new ServiceRegistry(service);
	await serviceRegistry.register();

	// Deregister service on exit
	process.on("SIGINT", async () => {
		await serviceRegistry.deregister();
		process.exit();
	});

	process.on("SIGTERM", async () => {
		await serviceRegistry.deregister();
		process.exit();
	});
}
