import { PlusOutlined } from '@ant-design/icons';
import { AnimatedContainer } from '@components/AnimatedContainer';
import LoadingSpinner from '@components/LoadingSpinner';
import {
  CountRequestCommentsDocument,
  FetchRequestCommentsDocument,
  useAddRequestCommentMutation,
  useCountRequestCommentsQuery,
  useFetchRequestCommentsQuery,
  useMeQuery,
} from '@graphql/generated';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { fadeInOutProps } from '@utils/AnimationsProps';
import { Badge, Button, Form, Input, message } from 'antd';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import RequestDetailComment from './RequestDetailComment';
import { Colours } from '@utils/Colours';

interface RequestDetailCommentsProps {
  requestId: string;
}

const RequestDetailComments: React.FC<RequestDetailCommentsProps> = ({ requestId }) => {
  const [addCommentVisible, setAddCommentVisible] = useState(false);
  const [shouldPollComments, setPollComments] = useState(false);

  const [form] = Form.useForm();

  const { data: userData } = useMeQuery({ fetchPolicy: 'cache-first' });
  const {
    data: commentsData,
    loading: fetchingComments,
    fetchMore,
    refetch: refetchComments,
  } = useFetchRequestCommentsQuery({
    variables: {
      requestId,
      first: 10,
    },
    fetchPolicy: 'cache-and-network',
  });

  const onEndReached = useCallback(() => {
    if (commentsData?.propertyRequestComments?.pageInfo.hasNextPage) {
      requestAnimationFrame(() => {
        fetchMore({
          variables: {
            after: commentsData?.propertyRequestComments?.pageInfo.endCursor,
          },
        });
      });
    }
  }, [commentsData?.propertyRequestComments?.pageInfo]);

  const sentinelRef = useInfiniteScroll(onEndReached);

  const [addCommentMutation, { loading: addingComment, data: addCommentData, error: addCommentError }] = useAddRequestCommentMutation();

  const { data: commentsCountData, refetch: refetchCommentsCount } = useCountRequestCommentsQuery({
    variables: {
      requestId,
    },
    fetchPolicy: 'cache-first',
  });

  const comments = useMemo(() => {
    return commentsData?.propertyRequestComments?.edges?.map((edge) => edge?.node);
  }, [commentsData]);

  const onClickAddComment = useCallback(() => {
    setAddCommentVisible(true);
  }, []);

  const onAddComment = useCallback(
    async (formValues: any) => {
      await addCommentMutation({
        variables: {
          requestId,
          authorName: formValues.authorName,
          messageBody: formValues.commentBody,
        },
        optimisticResponse: {
          __typename: 'RootMutationType',
          propertyRequestCommentCreate: {
            __typename: 'PropertyRequestComment',
            id: 'temp-id',
            authorName: formValues.authorName,
            messageBody: formValues.commentBody,
            insertedAt: new Date().toISOString(),
            systemGenerated: false,
          },
        },
        refetchQueries: [
          {
            query: FetchRequestCommentsDocument,
            variables: {
              requestId,
              first: 10,
            },
          },
          {
            query: CountRequestCommentsDocument,
            variables: {
              requestId,
            },
          },
        ],
      });

      setAddCommentVisible(false);
      form.resetFields();
    },
    [requestId]
  );

  useEffect(() => {
    if (shouldPollComments) {
      const interval = setInterval(() => {
        refetchCommentsCount();
        refetchComments();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [shouldPollComments]);

  return (
    <Container>
      <ContainerHeader>
        <ContainerTitle>
          Updates&nbsp;
          <Badge count={commentsCountData?.propertyRequestCommentsCount ? commentsCountData?.propertyRequestCommentsCount : 0} showZero color={Colours.NAVY} />
        </ContainerTitle>
        <AddCommentButton>
          <Button type="primary" icon={<PlusOutlined />} onClick={onClickAddComment}>
            Add a Comment
          </Button>
        </AddCommentButton>
      </ContainerHeader>

      <AnimatePresence>
        {addCommentVisible && (
          <AnimatedContainer {...fadeInOutProps}>
            <Form layout="vertical" form={form} onFinish={onAddComment} requiredMark={false}>
              <Form.Item
                label="Your Name:"
                name="authorName"
                rules={[{ required: true, message: 'Your name is required.' }]}
                initialValue={userData?.me && `${userData?.me?.firstName} ${userData?.me?.lastName}`}
              >
                <Input placeholder="Your Name" />
              </Form.Item>
              <Form.Item label="Message:" name="commentBody" rules={[{ required: true, message: 'A message is required.' }]}>
                <Input.TextArea placeholder="Lorem ipsum sit dolor emet" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={addingComment}>
                  Add Comment
                </Button>
              </Form.Item>
            </Form>
          </AnimatedContainer>
        )}
      </AnimatePresence>

      <CommentsContainer>
        {comments?.map((comment, index) => (
          <RequestDetailComment
            index={index}
            authorName={comment?.authorName}
            insertDate={comment?.insertedAt}
            messageBody={comment?.messageBody}
            systemGenerated={comment?.systemGenerated}
            onTopCommentVisibilityChanged={(visible) => setPollComments(visible)}
          />
        ))}
        {fetchingComments && !shouldPollComments && <LoadingSpinner size={24} containerStyle={{ padding: 0, margin: 0 }} />}
        <div ref={sentinelRef} />
      </CommentsContainer>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 40px;
`;

const ContainerTitle = styled.div`
  color: #262626;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  margin-bottom: 16px;
  flex: 1;
`;

const CommentsContainer = styled.div``;

const ContainerHeader = styled.div`
  display: flex;
`;

const AddCommentButton = styled.div``;

export default RequestDetailComments;
