const displayDate = (createdAt: number) => {
  const date = new Date(createdAt);
  const dateString = `${date.getFullYear()}.${
    date.getMonth() + 1
  }.${date.getDate()} ${date.getHours()}시 ${date.getMinutes()}분`;

  return dateString;
};
export default displayDate;
