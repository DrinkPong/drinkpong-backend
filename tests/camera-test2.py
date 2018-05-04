import numpy as np
import cv2
from matplotlib import pyplot as plt

capL = cv2.VideoCapture(2)
capR = cv2.VideoCapture(1)

w = capL.get(cv2.CAP_PROP_FRAME_WIDTH)
h = capL.get(cv2.CAP_PROP_FRAME_HEIGHT)
print('width: ' + str(w))
print('height:' + str(h))



while(True):
    # Capture frame-by-frame
    ret, frameL = capL.read()
    ret, frameR = capR.read()

    # Our operations on the frame come here
    grayL = cv2.cvtColor(frameL, cv2.COLOR_BGR2GRAY)
    grayR = cv2.cvtColor(frameR, cv2.COLOR_BGR2GRAY)

    # Display the resulting frame
    cv2.imshow('frameL',grayL)
    cv2.imshow('frameR',grayR)

    
    #stereo = cv2.createStereoBM(numDisparities=16, blockSize=15)
    stereo = cv2.StereoBM_create(numDisparities=16,  blockSize=15)
    disparity = stereo.compute(grayL,grayR)
    cv2.imshow('disparity',disparity / 2048)

    #plt.imshow(disparity,'gray')
    #plt.show()

 #   cv2.imshow('gray',gray)
    if cv2.waitKey(20) & 0xFF == ord('q'):
        break

# When everything done, release the capture
capL.release()
capR.release()
cv2.destroyAllWindows()
