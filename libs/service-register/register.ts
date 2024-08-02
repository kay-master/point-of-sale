import axios from "axios";

export interface ServiceRegistryPayload {
	ID: string;
	Name: string;

	/**
	 * Will be resolved through the Docker network
	 *
	 * Example: `http://auth`
	 */
	Address: string;
	Port: number;
	/** Example: "urlprefix-/auth" */
	Tags: string[];
	Check?: {
		HTTP: string;
		Method: "GET" | "POST" | "PUT";
		Interval: string;
		Name: string;
	};
}

export class ServiceRegistry {
	private service: ServiceRegistryPayload = {
		ID: "",
		Name: "",
		Address: "",
		Port: 0,
		Tags: [],
	};
	private CONSUL_URL = "";

	constructor(data: ServiceRegistryPayload) {
		this.service.ID = data.ID;
		this.service.Name = data.Name;
		this.service.Address = data.Address;
		this.service.Port = data.Port;
		this.service.Tags = data.Tags;
		// this.service.Check = data.Check;

		this.CONSUL_URL = `http://${process.env.CONSUL_ADDRESS || "localhost:8500"}/v1/agent/service`;
	}

	/**
	 * Register the service with Consul
	 */
	async register() {
		try {
			await axios.put(`${this.CONSUL_URL}/register`, this.service);

			console.log("Service registered with Consul");
		} catch (error) {
			console.error("Error registering service with Consul:", error);
		}
	}

	/**
	 * Deregister the service from Consul
	 */
	async deregister() {
		try {
			await axios.put(`${this.CONSUL_URL}/deregister/${this.service.ID}`);
			console.log("\nService deregistered from Consul");
		} catch (error) {
			console.error("Error de-registering service from Consul:", error);
		}
	}
}
