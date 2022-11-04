import Moment from 'react-moment';

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

function dateDiffInDays(a, b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

const calculateTime = (createdAt, t) => {
  const gun1 = new Date(Date.now());
  const gun2 = new Date(createdAt);

  const diffDays = dateDiffInDays(gun2, gun1);

  // console.log(gun1, gun2, diffDays);

  if (diffDays === 0) {
    return (
      <>
        {t('direct.today')} <Moment format="hh:mm A">{createdAt}</Moment>
      </>
    );
  }
  if (diffDays === 1) {
    return (
      <>
        {t('direct.Yesterday')} <Moment format="hh:mm A">{createdAt}</Moment>
      </>
    );
  }
  return <Moment format="DD/MM/YYYY hh:mm A">{createdAt}</Moment>;
};

export default calculateTime;
