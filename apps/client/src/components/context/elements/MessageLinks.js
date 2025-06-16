export default function MessageLinks({ listOfIds }) {
  const links = {
    messageReply: <>Reply</>,
  };

  return listOfIds.map((linkId) => links[linkId]).filter(Boolean);
}
