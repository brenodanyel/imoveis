import { useAuthStore } from '@/boot/stores';

class ACL {
	public readonly permissions = {
		'inicio.access': [],
		'anuncios.access': ['admin_geral', 'admin'],
		'usuarios.access': ['admin', 'admin_geral'],

		'area-administrativa.access': ['admin_geral'],
		'area-administrativa.usuarios.access': ['admin_geral'],
		'area-administrativa.empresas.access': ['admin_geral'],

		'area-administrativa.planos.access': ['admin_geral'],
		'area-administrativa.planos.create': ['admin_geral'],
		'area-administrativa.planos.edit': ['admin_geral'],

		'perfil.dados-da-empresa.access': ['admin_geral', 'admin'],
		'perfil.plano-da-empresa.access': ['admin_geral', 'admin'],

		'others.add-user-to-main_company': ['admin_geral'],
	};

	hasPermission(permission_name: keyof typeof this.permissions) {
		const { user, roles } = useAuthStore();

		if (!user) {
			return false;
		}

		const allowedRoles = this.permissions[permission_name];

		if (!allowedRoles) {
			return false;
		}

		if (allowedRoles.length === 0) {
			return true;
		}

		const has = allowedRoles.some((slug) => {
			return roles.some((role) => role.slug === slug);
		});

		return has;
	}
}

export const acl = new ACL();
