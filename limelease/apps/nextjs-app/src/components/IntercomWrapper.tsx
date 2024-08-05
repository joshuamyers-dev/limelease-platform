import { User } from '@graphql/generated';
import Intercom from '@intercom/messenger-js-sdk';

export const IntercomWrapper = ({ user }: { user: User }) => {
  Intercom({
    app_id: `${process.env.NEXT_PUBLIC_INTERCOM_APP_ID}`,
    user_id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
  });

  return null;
};
