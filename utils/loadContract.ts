const NETWORK_ID: any = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (name: string, web3: any) => {
  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();
  let contract = null;

  try {
    contract = new web3.eth.Contract(
      Artifact.abi,
      Artifact.networks[NETWORK_ID].address
    );
  } catch {
    console.log(`Contract ${name} cannot be loaded`);
  }

  return contract;
};
