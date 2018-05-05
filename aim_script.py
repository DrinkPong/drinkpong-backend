import cv2
import numpy as np
import math
import yaml
import os

def distance_to_camera(knownWidth, focalLength, perWidth):
    	# compute and return the distance from the maker to the camera
	return (knownWidth * focalLength) / perWidth


# opens the video stream
cap = cv2.VideoCapture(1)

# load the classifier
cup_cascade = cv2.CascadeClassifier('cup_cascade.xml')

# initialize the known distance from the camera to the object, which
	# in this case is 140 cm
KNOWN_DISTANCE = 110.0

KNOWN_PIXEL_WIDTH = 143.0

# initialize the known object width, which in this case, the piece of
# paper is 12 cmd wide
KNOWN_WIDTH = 12.0

# You can use the following 4 lines of code to load the data in file "calibration.yaml"
with open('./calibration.yaml') as f:
    loadeddict = yaml.load(f)
mtxloaded = np.array(loadeddict.get('camera_matrix'))
distloaded = np.array(loadeddict.get('dist_coeff'))


ret, img = cap.read()

h,  w = img.shape[:2]
newcameramtx, roi=cv2.getOptimalNewCameraMatrix(mtxloaded, distloaded,(w,h),1,(w,h))


# Capture frame-by-frame
ret, img = cap.read()
ret, img = cap.read()
ret, img = cap.read()

os.remove("result.json")
steve = open("result.json", "w")
steve.write("{")

iteration = 0
cups = []

while iteration < 50 :


	undistortedframe = cv2.undistort(img, mtxloaded, distloaded, None, newcameramtx)
	
	x,y,w,h = roi
	
	frame = undistortedframe[y:y+h, x:x+w] 
	
	# Haar only works in gray images
	gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	
	iteration_cups = cup_cascade.detectMultiScale(gray, 1.3, 5)

	if len(iteration_cups) > len(cups):
		cups = iteration_cups

	iteration = iteration + 1


focalLength = (KNOWN_PIXEL_WIDTH * KNOWN_DISTANCE) / KNOWN_WIDTH

cup_counter = 0

for (x,y,w,h) in cups:
	#cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)

	distance_x = distance_to_camera(KNOWN_WIDTH, focalLength, w)

	middle_x = x + (w/2)
	middle_y = y + (h/2)


    #    distance_y_scaled = (2 * (middle_y / 480) - 1)
    #    ascending_slope_degrees = 90 - (67 - 12 * distance_y_scaled)

    #    ascending_slope_radians = ascending_slope_degrees / 360.0 * 2.0 * 3.1459

    #    distance_johannes = (6 - 64) / -math.tan(ascending_slope_radians)


    #    distance_x_scaled = (2 * (middle_x / 640) - 1)
    #    distance_y = 35 * distance_x_scaled * distance_johannes / 140

	distance_y =   (middle_x - frame.shape[0]/2 ) * (3.0/8.0) * (frame.shape[1] - middle_y) / frame.shape[1]


	if cup_counter != 0:
		steve.write(",")
	steve.write("{") 
	steve.write('"x":'+str(distance_x)) 
	steve.write('"y":'+str(distance_y)) 
	steve.write("}") 
	cup_counter = cup_counter + 1


    #    distance_x_text = "% 2.1f" % (distance_x)
    #    distance_y_text = "% 2.1f" % (distance_y)

    #    middle_x_text = "% 2.1f" % (middle_x - frame.shape[0]/2)
    #    middle_y_text = "% 2.1f" % (frame.shape[1]/2 - middle_y)
        
    #    cv2.putText(frame, distance_x_text + ',' + distance_y_text,		(int(middle_x), int(middle_y)), cv2.FONT_HERSHEY_SIMPLEX,		0.5, (0, 0, 255), 2)

     #   cv2.putText(frame, middle_x_text + ',' + middle_y_text,
	#	(int(middle_x), int(y)), cv2.FONT_HERSHEY_SIMPLEX,
#		0.5, (0, 0, 0), 2)

   # cv2.putText(frame, str(len(cups)),
#	(frame.shape[1] - 200, frame.shape[0] - 20), cv2.FONT_HERSHEY_SIMPLEX,
#	2.0, (0, 0, 255), 3)

    # Display the resulting frame
 #   cv2.imshow('frame',frame)

  #  if cv2.waitKey(2000) & 0xFF == ord('q'):
   #     break

# When everything done, release the capture

steve.write("}")
steve.close()

cap.release()
cv2.destroyAllWindows()
