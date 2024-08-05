import axios from "axios";
import { SERVICE, SERVICE_NAME } from "./service-urls";

class ServiceDiscovery {
	static async getServiceAddress(serviceName: SERVICE): Promise<string> {
		const splitName = SERVICE_NAME[serviceName].split("/");

		const name = splitName[0].replace("_", "-").toLowerCase();
		const path = splitName[1];

		const consulHost = process.env.CONSUL_ADDRESS || "consul:8500";

		const response = await axios.get(
			`http://${consulHost}/v1/catalog/service/${name}`,
		);

		if (response.data.length === 0) {
			throw new Error(`Service ${name} not found`);
		}

		const serviceResponse = response.data[0];

		return `http://${serviceResponse.ServiceName}:${serviceResponse.ServicePort}/${path}`;
	}
}

export { ServiceDiscovery };
