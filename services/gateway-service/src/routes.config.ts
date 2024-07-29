interface ProxyRoute {
	upstream: string;
	prefix: string;
	authenticate: boolean;
}

const proxyRoutes: ProxyRoute[] = [
	{
		upstream: 'http://localhost:4001',
		prefix: '/auth',
		authenticate: false,
	},
	{
		upstream: 'http://localhost:4002',
		prefix: '/accounts',
		authenticate: true,
	},
];

export default proxyRoutes;
