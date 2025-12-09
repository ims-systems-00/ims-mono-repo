import KBEmbeded from "@/components/KnowledgeBase/Index";
import Loading from "@/components/Loader/Loading";
import useLinks from "@/hooks/useLinks";
import useScrollTracker from "@/hooks/useScrollTracker";
import {
  Button,
  DrawerOpener,
  DrawerRight,
  InputGroup,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import timePassedSinceCreated from "@/utils/timePassedSince";
import USER_ACTIONS from "./actions";
import useNotification from "./hooks/useNotifications";
const NotificationCard = ({ notification, link, time, onClick }) => {
  // single notification will be rendered in here ...
  return (
    <a href={link ? link : "#"}>
      <div className="card-notification border-bottom mb-3" onClick={onClick}>
        <div className="card-img">
          <img className="photo" alt="..." src={notification.icon} />
        </div>
        <div className="card-description">
          <span className="font-size-body-2">
            {notification.title}{" "}
            {notification.read.status === "unread" && (
              <span className="text-primary pull-right">⦿</span>
            )}
          </span>
          <p className="font-size-body-2">{notification.msg}</p>
          <h6 className="text-secondary font-size-caption">{time}</h6>
        </div>
      </div>
    </a>
  );
};

const Notifications = ({ notification }) => {
  // notifications container  ...
  const {
    processing,
    notifications,
    pagination,
    updateNotifications,
    updateSentStatus,
    updateReadStatus,
    getNewNotificationCounts,
  } = useNotification();
  let { toggle } = useDrawer();
  let { getLink } = useLinks();
  let [notficationsPane, handleScroll] = useScrollTracker(null, {
    onBottomReached: (element) => {
      if (!pagination.hasNextPage) return;
      !processing[USER_ACTIONS.LOAD_NOTIFICATIONS].status &&
        updateNotifications(pagination.nextPage || 1);
    },
  });
  return (
    <>
      <DrawerOpener
        onClick={() => {
          updateSentStatus();
        }}
        drawerId="notification-panel"
      >
        <Button
          size="sm"
          className="btn-icon d-flex"
          // onClick={() => {
          //   updateSentStatus();
          // }}
        >
          <div className="d-flex align-items-center font-size-subtitle-1">
            <i className="ims-icons-20 icon-icon-bellsimple-24 mt-1" />
            <p className="d-lg-none d-md-none mb-0 px-2">Notifications</p>
            <sup className="text-danger font-weight-bold">
              {getNewNotificationCounts() ? getNewNotificationCounts() : ""}
            </sup>
          </div>
        </Button>
      </DrawerOpener>
      <DrawerRight size={30} drawerId="notification-panel">
        <div
          ref={notficationsPane}
          className="mt-3 notifications-panel"
          onScroll={(e) => handleScroll()}
        >
          {processing[USER_ACTIONS.LOAD_NOTIFICATIONS].status && <Loading />}
          {notifications.length ? (
            notifications.map((notification) => {
              return (
                <NotificationCard
                  key={notification._id}
                  link={getLink(notification)}
                  notification={notification}
                  onClick={() => {
                    updateReadStatus(notification._id);
                    toggle("notification-panel");
                  }}
                  time={timePassedSinceCreated(notification.created.on)}
                />
              );
            })
          ) : (
            <span className="text-secondary">
              You have no notifications at the moment
            </span>
          )}
        </div>
      </DrawerRight>
    </>
  );
};
export default Notifications;
