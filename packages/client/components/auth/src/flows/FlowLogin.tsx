import { Match, Switch } from "solid-js";

import { styled } from "styled-system/jsx";

import { State, TransitionType } from "@revolt/client/Controller";
import { Navigate } from "@revolt/routing";
import { Button, Column, Preloader, Row, iconSize } from "@revolt/ui";

import MdArrowBack from "@material-design-icons/svg/filled/arrow_back.svg?component-solid";

import RevoltSvg from "../../../../public/assets/wordmark_wide_500px.svg?component-solid";
import { clientController } from "../../../client";

import { FlowTitle } from "./Flow";
import { Fields, Form } from "./Form";
import { Trans } from "@lingui-solid/solid/macro";

const Logo = styled(RevoltSvg, {
  base: {
    height: "0.8em",
    display: "inline",
    fill: "var(--colours-messaging-message-box-foreground)",
  },
});

/**
 * Flow for logging into an account
 */
export default function FlowLogin() {
  /**
   * Log into account
   * @param data Form Data
   */
  async function login(data: FormData) {
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    await clientController.login({
      email,
      password,
    });
  }

  /**
   * Select a new username
   * @param data Form Data
   */
  async function select(data: FormData) {
    const username = data.get("username") as string;
    await clientController.selectUsername(username);
  }

  return (
    <>
      <Switch
        fallback={
          <>
            <FlowTitle subtitle={<Trans>Sign into Revolt</Trans>} emoji="wave">
              <Trans>Welcome!</Trans>
            </FlowTitle>
            <Form onSubmit={login}>
              <Fields fields={["email", "password"]} />
              <Column gap="xl" align>
                <a href="/login/reset">
                  <Trans>Reset password</Trans>
                </a>
                <a href="/login/resend">
                  <Trans>Resend verification</Trans>
                </a>
              </Column>
              <Row align justify>
                <a href="..">
                  <Button variant="plain">
                    <MdArrowBack {...iconSize("1.2em")} /> <Trans>Back</Trans>
                  </Button>
                </a>
                <Button type="submit">
                  <Trans>Login</Trans>
                </Button>
              </Row>
            </Form>
          </>
        }
      >
        <Match when={clientController.isLoggedIn()}>
          <Navigate href="/app" />
        </Match>
        <Match when={clientController.lifecycle.state() === State.LoggingIn}>
          <Preloader type="ring" />
        </Match>
        <Match when={clientController.lifecycle.state() === State.Onboarding}>
          <FlowTitle
            subtitle={
              <Trans>
                Pick a username that you want people to be able to find you by.
                This can be changed later in your user settings.
              </Trans>
            }
          >
            <Row gap="sm">
              <Trans>Welcome to</Trans> <Logo />
            </Row>
          </FlowTitle>

          <Form onSubmit={select}>
            <Fields fields={["username"]} />
            <Row align justify>
              <Button
                variant="plain"
                onPress={() =>
                  clientController.lifecycle.transition({
                    type: TransitionType.Cancel,
                  })
                }
              >
                <MdArrowBack {...iconSize("1.2em")} /> <Trans>Cancel</Trans>
              </Button>
              <Button type="submit">
                <Trans>Confirm</Trans>
              </Button>
            </Row>
          </Form>
        </Match>
      </Switch>
    </>
  );
}
