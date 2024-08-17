import React from 'react';
import {FlatList} from 'react-native';

import type {ScrollViewProps} from 'react-native';

interface IProps extends ScrollViewProps {}

export type Props = React.FC<IProps>;

const VirtualizedList: Props = props => {
  return (
    <FlatList
      {...props}
      data={[]}
      keyExtractor={(_e, i) => 'dom' + i.toString()}
      ListEmptyComponent={null}
      renderItem={null}
      ListHeaderComponent={<>{props.children}</>}
    />
  );
};

export default VirtualizedList;
