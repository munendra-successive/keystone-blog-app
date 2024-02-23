/** @jsxRuntime classic */
/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from "@keystone-ui/core";
import { PageContainer } from "@keystone-6/core/admin-ui/components";
import { Heading } from "@keystone-ui/core";
import { useQuery, gql } from "@apollo/client";
import { Card } from "antd";

const GET_POSTS = gql`
  query Posts {
    posts {
      title
      customField
      status
      images {
        name
        image {
          url
        }
      }
    }
  }
`;

export default function CustomPage(props: any) {
  console.log("okffljdn", props);
  const { loading, error, data } = useQuery(GET_POSTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("data is: ", data?.posts);

  return (
    <PageContainer header={<Heading type="h3">Custom Page</Heading>}>
      {data.posts.map((item: any, index: any) => (
        <Card
          style={{
            display: "inline-block",
            margin: "20px",
          }}
        >
          <div>
            <img
              alt={item.images[0].name}
              width="100%"
              src={item.images[0].image.url}
              style={{ height: 150 }}
            />
          </div>
          <div>
            <h3>{item.title}</h3>
            <p>{item.customField}</p>
            <p>{item.status}</p>
          </div>
        </Card>
      ))}
    </PageContainer>
  );
}
