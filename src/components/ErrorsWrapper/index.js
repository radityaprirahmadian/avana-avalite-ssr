import images from 'src/constants/images';

import Button from '../Button';

export default function ErrorsWrapper({ error }) {

  return (
    <section className="min-h-screen flex flex-col justify-center items-center">
      <img
        className=""
        src={images.sad}
        width="100"
      />
      <section className="mt-2 text-lg font-semibold">
        {error.title
          ? error.title
          : (
            <>
              Sorry, something went wrong. Please try again or{' '}
              <span className="underline cursor-pointer"
                onClick={() => {
                  window.location.reload(true)
                }}
              >
                refresh the page
              </span>
            </>
          )
        }
      </section>
      {
        error.message && (
          <section className="bg-red-200 bg-opacity-50 text-red-700 leading-7 px-4 py-2">
            {error.message}
          </section>
        )
      }
      {
        error.action && (
          <section className="w-full my-12">
            <Button
              variant="contained"
              color="primary"
              href={error.action.to}
            >
              {error.action.label}
            </Button>
          </section>
        )
      }
    </section>
  )
}