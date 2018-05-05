import numpy as np
from sklearn.preprocessing import normalize
import cv2
 
capL = cv2.VideoCapture(1)
capR = cv2.VideoCapture(2)
ret, f = capL.read()

#kernelsize = 7
#kernel = np.ones((kernelsize,kernelsize),np.float32)/(kernelsize*kernelsize)
avgL = np.float32(f)
avgR = np.float32(f)

medianblur_size = 5

while True:
    ret, imgL = capL.read()
    #imgL = cv2.fastNlMeansDenoisingColored(imgL,None,10,10,7,21)
    imgL = cv2.medianBlur(imgL,medianblur_size)

    cv2.accumulateWeighted(imgL,avgL,0.1)
    imgL = cv2.convertScaleAbs(avgL)
    imgL = cv2.cvtColor(imgL, cv2.COLOR_BGR2GRAY)
    #imgL = cv2.filter2D(imgL2,-1,kernel)
    
    ret, imgR = capR.read()
    #imgR = cv2.fastNlMeansDenoisingColored(imgR,None,10,10,7,21)
    imgR = cv2.medianBlur(imgR,medianblur_size)

    cv2.accumulateWeighted(imgR,avgR,0.1)
    imgR = cv2.convertScaleAbs(avgR)
    imgR = cv2.cvtColor(imgR, cv2.COLOR_BGR2GRAY)
    #imgR = cv2.filter2D(imgR2,-1,kernel)
    # SGBM Parameters -----------------
    window_size = 5                     # wsize default 3; 5; 7 for SGBM reduced size image; 15 for SGBM full size image (1300px and above); 5 Works nicely
    
    left_matcher = cv2.StereoSGBM_create(
        minDisparity=12,
        numDisparities=16*5,             # max_disp has to be dividable by 16 f. E. HH 192, 256
        blockSize=5,
        P1=8 * 3 * window_size ** 2,    # wsize default 3; 5; 7 for SGBM reduced size image; 15 for SGBM full size image (1300px and above); 5 Works nicely
        P2=32 * 3 * window_size ** 2,
        disp12MaxDiff=1,
        uniquenessRatio=15,
        speckleWindowSize=42,
        speckleRange=12,
        preFilterCap=63,
        mode=cv2.STEREO_SGBM_MODE_HH
    )
    
    right_matcher = cv2.ximgproc.createRightMatcher(left_matcher)
    
    # FILTER Parameters
    lmbda = 80000
    sigma = 1.2
    visual_multiplier = 1.0
    
    wls_filter = cv2.ximgproc.createDisparityWLSFilter(matcher_left=left_matcher)
    wls_filter.setLambda(lmbda)
    wls_filter.setSigmaColor(sigma)
    
    print('computing disparity...')
    displ = left_matcher.compute(imgL, imgR)  # .astype(np.float32)/16
    dispr = right_matcher.compute(imgR, imgL)  # .astype(np.float32)/16
    displ = np.int16(displ)
    dispr = np.int16(dispr)
    filteredImg = wls_filter.filter(displ, imgL, None, dispr)  # important to put "imgL" here!!!
    
    filteredImg = cv2.normalize(src=filteredImg, dst=filteredImg, beta=0, alpha=255, norm_type=cv2.NORM_MINMAX);
    filteredImg = np.uint8(filteredImg)
    cv2.imshow('Disparity Map', filteredImg)
    cv2.waitKey(50)
cv2.destroyAllWindows()