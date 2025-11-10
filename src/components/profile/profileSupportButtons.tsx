import ButtonWrapper from '../shared/buttonWrapper';
import FullScreenButton from '../shared/fullScreenButton';

type ProfileSupportButtonsProps = {
    onSupportClick: () => void;
};

const ProfileSupportButtons = ({
    onSupportClick,
}: ProfileSupportButtonsProps) => (
    <ButtonWrapper>
        <FullScreenButton variant="light" onClick={onSupportClick}>
            Связаться с поддержкой в Telegram
        </FullScreenButton>
    </ButtonWrapper>
);

export default ProfileSupportButtons;
