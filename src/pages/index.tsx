import {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import { GraphQLClient, gql } from "graphql-request";
import { keystoneContext } from "./keystone/context";
import { useEffect, useState } from "react";

export const client = new GraphQLClient("http://localhost:3000/api/graphql");

const MainPage = ({
  users,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      Main Page
      <ClientRenderedContent />
      <ServerRenderedContent users={users} />
    </>
  );
};

function ClientRenderedContent() {
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch users from REST api route
  useEffect(() => {
    client
      .request(
        gql`
          {
            users {
              id
              name
            }
          }
        `
      )
      .then((data: any) => {
        setUsers(data.users);
      });
  }, []);

  return (
    <div style={{ minHeight: "8rem" }}>
      <p>
        <strong>Users fetched from the browser (in useEffect())</strong>
      </p>
      {users.length ? (
        <ol>
          {users.map((u) => {
            return (
              <li key={u.id}>
                <span>{u.name} </span>
              </li>
            );
          })}
        </ol>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const context = await keystoneContext.withRequest(req, res);
  const users = await context.query.User.findMany({
    query: "id name",
  });
  console.log("users are: ", users);

  return {
    props: { users: users }, // will be passed to the page component as props
  };
};

function ServerRenderedContent({
  users,
}: {
  users: { id: string; name: string }[];
}) {
  return (
    <div>
      <p>
        <strong>Users fetched from the server (in getServerSideProps)</strong>
      </p>
      <ol>
        {users.map((u) => {
          return (
            <li key={u.id}>
              <span>{u.name} </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default MainPage;
