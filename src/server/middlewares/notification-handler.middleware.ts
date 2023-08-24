import { getServerSession } from '@roq/nextjs';
import { NextApiRequest } from 'next';
import { NotificationService } from 'server/services/notification.service';
import { convertMethodToOperation, convertRouteToEntityUtil, HttpMethod, generateFilterByPathUtil } from 'server/utils';
import { prisma } from 'server/db';

interface NotificationConfigInterface {
  roles: string[];
  key: string;
  tenantPath: string[];
  userPath: string[];
}

const notificationMapping: Record<string, NotificationConfigInterface> = {
  'user.update': {
    roles: ['system-administrator'],
    key: 'healthcare-provider-profile-update',
    tenantPath: ['organization', 'user'],
    userPath: [],
  },
  'appointment.create': {
    roles: ['system-administrator', 'medical-staff'],
    key: 'new-appointment-slot',
    tenantPath: ['organization', 'user', 'appointment'],
    userPath: [],
  },
  'patient_record.update': {
    roles: ['system-administrator', 'healthcare-provider'],
    key: 'patient-record-update',
    tenantPath: ['organization', 'user', 'patient_record'],
    userPath: [],
  },
  'insurance_plan.create': {
    roles: ['system-administrator', 'healthcare-provider', 'medical-staff'],
    key: 'new-insurance-plan',
    tenantPath: ['organization', 'user', 'insurance_plan'],
    userPath: [],
  },
  'appointment.update': {
    roles: ['system-administrator', 'healthcare-provider', 'medical-staff'],
    key: 'guest-appointment-update',
    tenantPath: ['organization', 'user', 'appointment'],
    userPath: [],
  },
  'insurance_plan.update': {
    roles: ['system-administrator', 'insurance-provider'],
    key: 'guest-insurance-details-update',
    tenantPath: ['organization', 'user', 'insurance_plan'],
    userPath: [],
  },
};

const ownerRoles: string[] = ['system-administrator'];
const customerRoles: string[] = ['guest'];
const tenantRoles: string[] = ['system-administrator', 'healthcare-provider', 'medical-staff', 'insurance-provider'];

const allTenantRoles = tenantRoles.concat(ownerRoles);
export async function notificationHandlerMiddleware(req: NextApiRequest, entityId: string) {
  const session = getServerSession(req);
  const { roqUserId } = session;
  // get the entity based on the request url
  let [mainPath] = req.url.split('?');
  mainPath = mainPath.trim().split('/').filter(Boolean)[1];
  const entity = convertRouteToEntityUtil(mainPath);
  // get the operation based on request method
  const operation = convertMethodToOperation(req.method as HttpMethod);
  const notificationConfig = notificationMapping[`${entity}.${operation}`];

  if (!notificationConfig || notificationConfig.roles.length === 0 || !notificationConfig.tenantPath?.length) {
    return;
  }

  const { tenantPath, key, roles, userPath } = notificationConfig;

  const tenant = await prisma.organization.findFirst({
    where: generateFilterByPathUtil(tenantPath, entityId),
  });

  if (!tenant) {
    return;
  }
  const sendToTenant = () => {
    console.log('sending notification to tenant', {
      notificationConfig,
      roqUserId,
      tenant,
    });
    return NotificationService.sendNotificationToRoles(key, roles, roqUserId, tenant.tenant_id);
  };
  const sendToCustomer = async () => {
    if (!userPath.length) {
      return;
    }
    const user = await prisma.user.findFirst({
      where: generateFilterByPathUtil(userPath, entityId),
    });
    console.log('sending notification to user', {
      notificationConfig,
      user,
    });
    await NotificationService.sendNotificationToUser(key, user.roq_user_id);
  };

  if (roles.every((role) => allTenantRoles.includes(role))) {
    // check if only  tenantRoles + ownerRoles
    await sendToTenant();
  } else if (roles.every((role) => customerRoles.includes(role))) {
    // check if only customer role
    await sendToCustomer();
  } else {
    // both company and user receives
    await Promise.all([sendToTenant(), sendToCustomer()]);
  }
}
