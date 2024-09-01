import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {Portal} from '@gorhom/portal';
import {forwardRef, ReactNode} from 'react';
import {Keyboard, Platform, StyleSheet, View} from 'react-native';
import {FullWindowOverlay} from 'react-native-screens';

interface BottomSheetWrapperProps {
  children: ReactNode;
  height: number;
}

const BottomSheetWrapper = forwardRef<BottomSheet, BottomSheetWrapperProps>(
  ({children, height = 300}, ref) => {
    const OverlayOrView = Platform.OS === 'ios' ? FullWindowOverlay : View;

    return (
      <Portal>
        <OverlayOrView style={StyleSheet.absoluteFill}>
          <BottomSheet
            ref={ref}
            index={-1}
            enableContentPanningGesture={false}
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
        </OverlayOrView>
      </Portal>
    );
  },
);

export default BottomSheetWrapper;
