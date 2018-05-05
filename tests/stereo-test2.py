import numpy as np
import cv2

def cut(disparity, image, threshold):
    for i in range(0, image.height):
        for j in range(0, image.width):
            # keep closer object
            if cv2.GetReal2D(disparity,i,j) > threshold:
                cv2.Set2D(disparity,i,j,cv2.Get2D(image,i,j))

# loading the stereo pair
#left  = cv.LoadImage('scene_l.bmp',cv.CV_LOAD_IMAGE_GRAYSCALE)
#right = cv.LoadImage('scene_r.bmp',cv.CV_LOAD_IMAGE_GRAYSCALE)

capL = cv2.VideoCapture(1)
capR = cv2.VideoCapture(2)

#kernelsize = 7
#kernel = np.ones((kernelsize,kernelsize),np.float32)/(kernelsize*kernelsize)
while True:
    ret, imgL2 = capL.read()
    imgL3 = cv2.cvtColor(imgL2, cv2.COLOR_BGR2GRAY)
    left = cv2.medianBlur(imgL3,5)
    #imgL = cv2.filter2D(imgL2,-1,kernel)
    
    ret, imgR2 = capR.read()
    imgR3 = cv2.cvtColor(imgR2, cv2.COLOR_BGR2GRAY)
    right = cv2.medianBlur(imgR3,5)
    #imgR = cv2.filter2D(imgR2,-1,kernel)

    disparity_left = np.array((left.height, left.width,1), np.uint8)
    disparity_right = np.array((left.height, left.width,1), np.uint8)
    #disparity_left  = cv2.CreateMat(left.height, left.width, cv2.CV_16S)
    #disparity_right = cv2.CreateMat(left.height, left.width, cv2.CV_16S)

    # data structure initialization
    state = cv2.CreateStereoGCState(16,2)
    # running the graph-cut algorithm
    cv2.FindStereoCorrespondenceGC(left,right,
                            disparity_left,disparity_right,state)

    disp_left_visual = cv2.CreateMat(left.height, left.width, cv2.CV_8U)
    cv2.ConvertScale( disparity_left, disp_left_visual, -16 );
    cv2.Save( "disparity.pgm", disp_left_visual ); # save the map

    # cutting the object farthest of a threshold (120)
    cut(disp_left_visual,left,120)

    cv2.NamedWindow('Disparity map', cv2.CV_WINDOW_AUTOSIZE)
    cv2.ShowImage('Disparity map', disp_left_visual)
    cv2.WaitKey()