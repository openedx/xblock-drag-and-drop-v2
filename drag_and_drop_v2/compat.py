"""
Compatibility layer to isolate core-platform waffle flags from implementation.
"""

# Waffle flags configuration

# Namespace
WAFFLE_NAMESPACE = "drag_and_drop_v2"

# Course Waffle Flags
# .. toggle_name: drag_and_drop_v2.grading_ignore_decoys
# .. toggle_implementation: CourseWaffleFlag
# .. toggle_default: False
# .. toggle_description: Enables alternative grading for the xblock
#    that does not include decoy items in the score.
# .. toggle_use_cases: open_edx
# .. toggle_creation_date: 2022-11-10
GRADING_IGNORE_DECOYS = 'grading_ignore_decoys'


def get_grading_ignore_decoys_waffle_flag():
    """
    Import and return Waffle flag for enabling alternative grading for drag_and_drop_v2 Xblock.
    """
    # pylint: disable=import-error,import-outside-toplevel
    from openedx.core.djangoapps.waffle_utils import CourseWaffleFlag
    try:
        # HACK: The base class of the `CourseWaffleFlag` was changed in Olive.
        #  Ref: https://github.com/openedx/public-engineering/issues/28
        return CourseWaffleFlag(WAFFLE_NAMESPACE, GRADING_IGNORE_DECOYS, __name__)
    except ValueError:
        return CourseWaffleFlag(f'{WAFFLE_NAMESPACE}.{GRADING_IGNORE_DECOYS}', __name__)
