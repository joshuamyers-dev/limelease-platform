import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

type PageInfo = {
  endCursor: string | null | undefined;
};

type Data = {
  pageInfo: PageInfo;
};

type UsePaginationProps = {
  pageInfo: PageInfo | undefined;
  fetchMore: (options: { after: string | undefined; first: number }) => Promise<any>;
  initialFetchAmount: number;
  data: Data;
};

export const usePagination = ({ data, fetchMore, initialFetchAmount }: UsePaginationProps) => {
  const [endCursorStack, setEndCursorStack] = useState<string[]>([]);

  const pageInfo = data?.pageInfo;

  const onClickForward = useCallback(async () => {
    const endCursor = pageInfo?.endCursor;

    if (endCursor) {
      setEndCursorStack((prev) => [...prev, endCursor]);
    }

    await fetchMore({
      variables: {
        after: endCursor,
        first: initialFetchAmount,
      },
      notifyOnNetworkStatusChange: true,
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      },
    });
  }, [data, fetchMore]);

  const onClickBack = useCallback(async () => {
    const newStack = [...endCursorStack];

    newStack.pop();

    const beforeCursor = newStack[newStack.length - 1];

    setEndCursorStack(newStack);

    await fetchMore({
      variables: {
        before: beforeCursor,
        last: initialFetchAmount,
      },
      notifyOnNetworkStatusChange: true,
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      },
    });
  }, [fetchMore, endCursorStack]);

  return { onClickForward, onClickBack };
};
