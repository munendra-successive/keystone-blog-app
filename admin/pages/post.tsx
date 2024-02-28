/** @jsxRuntime classic */
/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from "@keystone-ui/core";
import { PageContainer } from "@keystone-6/core/admin-ui/components";
import { Heading } from "@keystone-ui/core";
import { useQuery, gql } from "@keystone-6/core/admin-ui/apollo";
import { Card } from "antd";
import { useRouter } from "@keystone-6/core/admin-ui/router";
import { Button } from "@keystone-ui/button";
import { EditIcon } from "@keystone-ui/icons";
import { context } from "../../getContext";
import { useEffect } from "react";

const GET_POSTS = gql`
  query Posts {
    posts {
      id
      title
      status
      images {
        image {
          url
          id
        }
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation Mutation($where: PostWhereUniqueInput!) {
    deletePost(where: $where) {
      id
    }
  }
`;

const getData = async () => {
  try {
    // const result = await context.query.User.count({});
    const result = "hello";
    console.log("result: ", result);
    return result;
  } catch (error) {
    console.log("errro");
  }
};

export default function Posts() {
  const router = useRouter();
  useEffect(() => {
    console.log("useeffe");
    // const ok =
    getData();
    // console.log("data is: ", ok);
  }, []);

  const { loading, error, data } = useQuery(GET_POSTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("data is: ", data?.posts);

  const handleClick = (index: string | number) => {
    router.push({
      pathname: "/view-image",
      query: { id: data.posts[index].images[0].image.id },
    });
  };

  const handleView = (index: string | number) => {
    router.push({
      pathname: "/view-post",
      query: { id: data.posts[index].id },
    });
  };

  const handleEdit = (index: string | number) => {
    router.push(`/posts/${data.posts[index].id}`);
  };

  return (
    <PageContainer header={<Heading type="h3">Posts</Heading>}>
      {data.posts.map((item: any, index: any) => (
        <Card
          style={{
            display: "inline-block",
            margin: "20px",
          }}
        >
          <div>
            <img
              onClick={() => handleClick(index)}
              alt={item.images[0].name}
              width="100%"
              src={item.images[0].image.url}
              style={{ height: 150 }}
              id={item.images[0].image.id}
            ></img>
          </div>
          <div>
            <h3>{item.title}</h3>
            <p>Status: {item.status}</p>
            {/* <Button onClick={() => handleView(index)}>
              <EyeIcon />
            </Button> */}
            <Button onClick={() => handleEdit(index)}>
              <EditIcon />
            </Button>
          </div>
        </Card>
      ))}
    </PageContainer>
  );
}
