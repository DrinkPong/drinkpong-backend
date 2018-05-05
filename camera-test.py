import numpy as np
import cv2

capright = cv2.VideoCapture(0)
capleft = cv2.VideoCapture(1)


while(True):
    # Capture frame-by-frame
    retright, frameright = capright.read()
    retleft, frameleft = capleft.read()

    # Our operations on the frame come here
#    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Display the resulting frame
    cv2.imshow('left',frameleft)
    cv2.imshow('right',frameright)
 #   cv2.imshow('gray',gray)
    if cv2.waitKey(20) & 0xFF == ord('q'):
        break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
