import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {Portal} from '@gorhom/portal';
import {forwardRef, ReactNode} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import {FullWindowOverlay} from 'react-native-screens';

interface BottomSheetWrapperProps {
  children: ReactNode;
  height: number;
}

const BottomSheetWrapper = forwardRef<BottomSheet, BottomSheetWrapperProps>(
  ({children, height = 300}, ref) => {
    return (
      <Portal>
        <FullWindowOverlay style={StyleSheet.absoluteFill}>
          <BottomSheet
            ref={ref}
            index={-1}
            enableContentPanningGesture
            enablePanDownToClose
            keyboardBehavior="interactive"
            backdropComponent={props => (
              <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
            )}
            onChange={() => Keyboard.dismiss()}
            handleStyle={{opacity: 0}}
            snapPoints={[height]}>
            {children}
          </BottomSheet>
        </FullWindowOverlay>
      </Portal>
    );
  },
);

export default BottomSheetWrapper;
