const getNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/notifications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching notifications:", err.message);
  }
};

const deleteNotification = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete notification");
    }
  } catch (err) {
    console.error("Error deleting notification:", err.message);
  }
};

const handleDeleteNotification = async (e) => {
  try {
    e.preventDefault();
    const notificationId = e.target.parentElement.dataset.notificationId;
    await deleteNotification(notificationId);
    displayNotifications();
  } catch (err) {
    console.error("Error deleting notification:", err.message);
    M.toast({ html: "Failed to delete notification", classes: "red" });
  }
};

const deleteButtonIcon = (notificationId) => {
  const deleteButton = document.createElement("a");
  deleteButton.dataset.notificationId = notificationId;
  deleteButton.innerHTML = '<i class="material-icons">delete</i>';
  deleteButton.classList.add("delete-notification", "center");
  deleteButton.addEventListener("click", handleDeleteNotification);

  return deleteButton;
};

const addNotificationToMenu = (notifications) => {
  const notificationsContainer = document.querySelector(
    "#notifications-container",
  );
  notificationsContainer.innerHTML = "";

  notifications.forEach((notification) => {
    const notificationElement = document.createElement("li");
    const notificationMessage = document.createElement("p");
    notificationElement.classList.add("notification-item");
    notificationMessage.classList.add("notification-text");
    notificationMessage.textContent = notification.message;
    notificationElement.appendChild(notificationMessage);
    notificationElement.appendChild(deleteButtonIcon(notification._id));
    notificationsContainer.appendChild(notificationElement);
  });
};

const growingEffect = (element) => {
  element.classList.add("grow");
  setTimeout(() => {
    element.classList.remove("grow");
  }, 1000);
};

const displayNotifications = async () => {
  try {
    const notificationElements = document.querySelectorAll(".dropdown-trigger");
    const notificationIcon = document.querySelector(".notifications-icon");
    const notifications = await getNotifications();
    if (notifications?.length > 0) {
      growingEffect(notificationIcon);
      notificationIcon.textContent = "notifications_active";
      addNotificationToMenu(notifications);
    }

    M.Dropdown.init(notificationElements, {
      constrainWidth: false,
      coverTrigger: false,
    });
  } catch (err) {
    console.error("Error initializing notifications menu:", err.message);
  }
};

export { displayNotifications };
