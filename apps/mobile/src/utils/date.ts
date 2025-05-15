import { duration } from "@potential/utils";

export const timeAgoText = ({ date }: { date: Date }) => {
  const timeBetweenInputAndNow =
    new Date().valueOf() - new Date(date).valueOf();

  const timeAgo = duration(timeBetweenInputAndNow, { parts: 1 });
  const timeAgoLabel = timeAgo.toString().split(" ")[1];
  const timeAgoValue = timeAgo.toString().split(".")[0];

  return `${timeAgoValue} ${timeAgoLabel} ago`;
};
