/**
 * Project Types Data
 * Single Responsibility: Define all available project types
 */

import { ProjectTypeDefinition } from './models';

export const PROJECT_TYPE_DEFINITIONS: readonly ProjectTypeDefinition[] = [
	new ProjectTypeDefinition(
		'landing-page',
		'🌐 Landing Page',
		'Marketing sites and product showcases',
		'/icon/landing-page.svg',
		'from-blue-500 to-blue-700',
		['webFrontend', 'uiSystem', 'analytics', 'cms', 'webDeploy'],
		{
			webFrontend: ['next'],
			uiSystem: 'xala',
			analytics: 'vercel-analytics',
			webDeploy: 'vercel'
		}
	),
	new ProjectTypeDefinition(
		'web-app',
		'🌐 Web App',
		'Full-featured web applications',
		'/icon/web-app.svg',
		'from-green-500 to-green-700',
		['webFrontend', 'backend', 'database', 'auth', 'uiSystem', 'analytics', 'webDeploy'],
		{
			webFrontend: ['next'],
			backend: ['next'],
			database: ['postgres'],
			auth: ['better-auth'],
			payments: 'stripe',
			analytics: 'vercel-analytics',
			security: ['snyk']
		}
	),
	new ProjectTypeDefinition(
		'mobile-app',
		'📱 Mobile App',
		'Native mobile applications',
		'/icon/mobile-app.svg',
		'from-purple-500 to-purple-700',
		['nativeFrontend', 'backend', 'database', 'auth', 'uiSystem', 'analytics'],
		{
			webFrontend: ['next'],
			cms: ['strapi'],
			analytics: 'vercel-analytics',
			uiSystem: 'xala'
		}
	),
	new ProjectTypeDefinition(
		'desktop-app',
		'🖥️ Desktop App',
		'Cross-platform desktop applications',
		'/icon/desktop-app.svg',
		'from-indigo-500 to-indigo-700',
		['nativeFrontend', 'backend', 'database', 'auth', 'uiSystem'],
		{
			webFrontend: ['next'],
			backend: ['next'],
			database: ['postgres'],
			auth: ['better-auth'],
			monitoring: 'sentry'
		}
	),
	new ProjectTypeDefinition(
		'api-only',
		'🔌 API Only',
		'Backend APIs and microservices',
		'/icon/api-only.svg',
		'from-yellow-500 to-yellow-700',
		['backend', 'database', 'auth', 'api', 'testing', 'monitoring'],
		{
			backend: ['hono'],
			database: ['postgres'],
			orm: ['drizzle'],
			auth: ['better-auth'],
			monitoring: 'sentry'
		}
	),
	new ProjectTypeDefinition(
		'enterprise',
		'🏢 Enterprise',
		'Large-scale enterprise applications',
		'/icon/enterprise.svg',
		'from-gray-600 to-gray-800',
		['webFrontend', 'backend', 'database', 'auth', 'security', 'monitoring', 'compliance'],
		{
			saasAdmin: 'admin-dashboard',
			subscriptions: 'stripe-billing',
			licensing: 'feature-flags',
			rbac: 'role-permissions',
			multiTenancy: ['schema-separation'],
			monitoring: 'sentry',
			security: ['snyk'],
			compliance: ['gdpr']
		}
	),
	new ProjectTypeDefinition(
		'saas',
		'💼 SaaS',
		'Software as a Service applications',
		'/icon/saas.svg',
		'from-teal-500 to-teal-700',
		['webFrontend', 'backend', 'database', 'auth', 'payments', 'analytics', 'saasAdmin', 'subscriptions'],
		{
			saasAdmin: 'admin-dashboard',
			subscriptions: 'stripe-billing',
			licensing: 'feature-flags',
			rbac: 'role-permissions',
			devops: ['docker']
		}
	),
	new ProjectTypeDefinition(
		'norwegian-gov',
		'🇳🇴 Norwegian Gov',
		'Norwegian government compliant applications',
		'/icon/norwegian-gov.svg',
		'from-red-500 to-red-700',
		['webFrontend', 'backend', 'database', 'auth', 'compliance', 'security'],
		{
			backend: ['dotnet'],
			database: ['mssql'],
			orm: ['entity-framework'],
			auth: ['identity-server'],
			saasAdmin: 'admin-dashboard',
			subscriptions: 'stripe-billing',
			licensing: 'feature-flags',
			rbac: 'role-permissions',
			multiTenancy: ['schema-separation'],
			messaging: 'rabbitmq',
			compliance: ['iso27001']
		}
	),
] as const;
