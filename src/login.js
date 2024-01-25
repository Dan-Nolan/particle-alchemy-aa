import { ParticleNetwork } from "@particle-network/auth";
import { ParticleProvider } from "@particle-network/provider";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { WalletClientSigner } from "@alchemy/aa-core";

import { polygonMumbai } from "viem/chains";
import { createWalletClient, custom } from "viem";

let provider;

document.getElementById("login").addEventListener("click", async function () {
  const particle = new ParticleNetwork({
    projectId: process.env.PARTICLE_APP_PROJECT_ID,
    clientKey: process.env.PARTICLE_APP_CLIENT_KEY,
    appId: process.env.PARTICLE_APP_ID,
    chainName: "polygon",
    chainId: 80001,
  });

  await particle.auth.login({ preferredAuthType: "google" });

  provider = new AlchemyProvider({
    apiKey: process.env.ALCHEMY_API_KEY,
    chain: polygonMumbai,
  })
    .connect(
      (rpcClient) =>
        new LightSmartContractAccount({
          chain: rpcClient.chain,
          owner: new WalletClientSigner(
            createWalletClient({
              transport: custom(new ParticleProvider(particle.auth)),
            }),
            "particle"
          ),
          factoryAddress: getDefaultLightAccountFactoryAddress(rpcClient.chain),
          rpcClient,
        })
    )
    .withAlchemyGasManager({
      policyId: process.env.ALCHEMY_POLICY_ID,
    });

  document.getElementById("login").style = "display:none";
  document.getElementById("address").innerText =
    await provider.account.getAddress();
});

export function getProvider() {
  return provider;
}
