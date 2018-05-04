'''
Simple example of stereo image matching and point cloud generation.
Resulting .ply file cam be easily viewed using MeshLab ( http://meshlab.sourceforge.net/ )
'''

import numpy as np
import cv2

ply_header = '''ply
format ascii 1.0
element vertex %(vert_num)d
property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
end_header
'''

def write_ply(fn, verts, colors):
    verts = verts.reshape(-1, 3)
    colors = colors.reshape(-1, 3)
    verts = np.hstack([verts, colors])
    with open(fn, 'w') as f:
        f.write(ply_header % dict(vert_num=len(verts)))
        np.savetxt(f, verts, '%f %f %f %d %d %d')


if __name__ == '__main__':
    print('loading images...')
    #imgL = cv2.pyrDown( cv2.imread('../gpu/aloeL.jpg') )  # downscale images for faster processing
    #imgR = cv2.pyrDown( cv2.imread('../gpu/aloeR.jpg') )

    capL = cv2.VideoCapture(1)
    capR = cv2.VideoCapture(2)
    ret, f = capL.read()

    #kernelsize = 7
    #kernel = np.ones((kernelsize,kernelsize),np.float32)/(kernelsize*kernelsize)
    avgL = np.float32(f)
    avgR = np.float32(f)

    while True:
        ret, imgL = capL.read()
        #imgL = cv2.fastNlMeansDenoisingColored(imgL,None,10,10,7,21)
        imgL = cv2.medianBlur(imgL,3)

        cv2.accumulateWeighted(imgL,avgL,0.1)
        imgL = cv2.convertScaleAbs(avgL)
        imgL = cv2.cvtColor(imgL, cv2.COLOR_BGR2GRAY)
        #imgL = cv2.filter2D(imgL2,-1,kernel)
        
        ret, imgR = capR.read()
        #imgR = cv2.fastNlMeansDenoisingColored(imgR,None,10,10,7,21)
        imgR = cv2.medianBlur(imgR,3)

        cv2.accumulateWeighted(imgR,avgR,0.1)
        imgR = cv2.convertScaleAbs(avgR)
        imgR = cv2.cvtColor(imgR, cv2.COLOR_BGR2GRAY)

        # disparity range is tuned for 'aloe' image pair
        window_size = 5
        min_disp = 4
        num_disp = 128
        stereo = cv2.StereoSGBM_create(minDisparity = min_disp,
            numDisparities = num_disp,
            blockSize = window_size,
            uniquenessRatio = 10,
            speckleWindowSize = 45,
            speckleRange = 16,
            disp12MaxDiff = 1,
            P1 = 8*3*window_size**2,
            P2 = 32*3*window_size**2
        )

        print('computing disparity...')
        disp = stereo.compute(imgL, imgR).astype(np.float32) / 16.0

        ''' print('generating 3d point cloud...')
        h, w = imgL.shape[:2]
        f = 0.8*w                          # guess for focal length
        Q = np.float32([[1, 0, 0, -0.5*w],
                        [0,-1, 0,  0.5*h], # turn points 180 deg around x-axis,
                        [0, 0, 0,     -f], # so that y-axis looks up
                        [0, 0, 1,      0]])
        points = cv2.reprojectImageTo3D(disp, Q)
        colors = cv2.cvtColor(imgL, cv2.COLOR_BGR2RGB)
        mask = disp > disp.min()
        out_points = points[mask]
        out_colors = colors[mask]
        out_fn = 'out.ply'
        write_ply('out.ply', out_points, out_colors)
        print('%s saved' % 'out.ply') '''

        cv2.imshow('left', imgL)
        cv2.imshow('right', imgR)
        cv2.imshow('disparity', (disp-min_disp)/num_disp)
        cv2.waitKey(20)
    cv2.destroyAllWindows()