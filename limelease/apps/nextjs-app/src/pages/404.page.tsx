import EmptyState from '@components/EmptyState';
import { Heading1 } from '@components/Headings';
import DashboardContainer from '@containers/DashboardContainer';

import notFoundImage from '@public/images/404.svg';

export default function Custom404() {
  return (
    <DashboardContainer>
      <EmptyState
        title="We can’t summon your page."
        description="You can dive deep into the astral plane or you can contact us for help."
        image={notFoundImage}
        buttonCtaText="Take me back home"
        routeTo="/properties"
      />
    </DashboardContainer>
  );
}
