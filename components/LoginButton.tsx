export default function LoginButton({
  buttonText,
  imageSrc,
}: {
  buttonText: string;
  imageSrc?: string;
}) {
  return (
    <form
      action="/auth/sign-in"
      method="post"
      className="flex justify-center items-center"
    >
      <button className=" px-4 font-bold text-black rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
        {imageSrc && <img src={imageSrc} alt="Google logo" />}
        {buttonText}
      </button>
    </form>
  );
}
